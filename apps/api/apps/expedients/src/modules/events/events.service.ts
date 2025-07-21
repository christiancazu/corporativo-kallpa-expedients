import { InjectQueue } from '@nestjs/bullmq'
import {
  BadRequestException,
  Injectable,
  type OnModuleInit,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Job, Queue } from 'bullmq'
import { Between, type Repository } from 'typeorm'
import { Expedient } from '../expedients/entities/expedient.entity'
import { User } from '../users/entities/user.entity'
import { CreateEventDto } from './dto/create-event.dto'
import { Event } from './entities/event.entity'
import {
  EVENT_QUEUE,
  INTERVAL_SCHEDULED,
  type JobEvent,
  type JobEventData,
} from './types'

@Injectable()
export class EventsService implements OnModuleInit {
  constructor(
    @InjectRepository(Event)
    private readonly _eventsRepository: Repository<Event>,

    @InjectQueue(EVENT_QUEUE) private _expedientsQueue: Queue<JobEventData>,
  ) {}

  async onModuleInit() {
    await this.removeJobs()

    this.setupScheduledEvents()
  }

  async removeJobs() {
    await this._expedientsQueue.drain()
    const currentJobs = await this._expedientsQueue.getJobs()
    await Promise.all(
      currentJobs.map((job: Job) => job.remove({ removeChildren: true })),
    )
  }

  async setupScheduledEvents() {
    const nowTime = Date.now()

    const events = await this._eventsRepository.find({
      where: {
        scheduledAt: Between(
          new Date(nowTime),
          new Date(nowTime + INTERVAL_SCHEDULED),
        ),
      },
      relations: {
        expedient: true,
      },
      select: {
        id: true,
        scheduledAt: true,
        expedient: {
          id: true,
        },
      },
    })

    const jobs: JobEvent[] = events.map((event) => ({
      name: EVENT_QUEUE,
      data: {
        expedientId: event.expedient.id,
        eventId: event.id,
      },
      opts: {
        removeOnComplete: true,
        removeOnFail: true,
        delay: Number(new Date(event.scheduledAt).getTime() - Date.now()),
      },
    }))

    await this._expedientsQueue.addBulk(jobs)
  }

  async delete(id: string) {
    const jobs = await this._expedientsQueue.getJobs()
    const existingJob = jobs.find((job) => job.data.expedientId === id)

    if (existingJob) {
      await this._expedientsQueue.remove(existingJob.id!)
    }

    return this._eventsRepository.delete(id)
  }

  async create(user: User, dto: CreateEventDto) {
    const delay = this.ensureAvailableDateEvent(dto.scheduledAt)

    const event = this._eventsRepository.create({
      message: dto.message,
      createdByUser: user,
      expedient: new Expedient(dto.expedientId),
      scheduledAt: dto.scheduledAt,
    })

    const eventsaved = await this._eventsRepository.save(event)

    const isAvailableForCurrentQueue = delay < INTERVAL_SCHEDULED

    if (isAvailableForCurrentQueue) {
      return this._expedientsQueue.add(
        EVENT_QUEUE,
        { expedientId: dto.expedientId, eventId: eventsaved.id },
        { delay },
      )
    }
  }

  findAll() {
    return this._eventsRepository.find()
  }

  findOne(id: string) {
    return this._eventsRepository.findOne({ where: { id } })
  }

  findAllPending() {
    return this._expedientsQueue.getJobs()
  }
  update(id: string, Event: Partial<Event>) {
    return this._eventsRepository.update(id, Event)
  }

  private ensureAvailableDateEvent(date: string) {
    const dateTimeInt = Number(new Date(date).getTime() - Date.now())

    if (dateTimeInt < 0) {
      throw new BadRequestException('La fecha debe ser mayor a la actual')
    }

    return dateTimeInt
  }
}
