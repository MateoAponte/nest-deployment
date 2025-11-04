import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { USERS_FIND_ALL } from '../constants/CacheKeys';
import type IORedis from 'ioredis';
import { REDIS_TTL } from 'src/redis/constants/RedisTTL';

@Injectable()
export class UsersService {
  constructor(
    /**
     * Inject CacheManager
     */
    @Inject('REDIS')
    private readonly cacheManager: IORedis,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    const usersCached = await this.cacheManager.get(USERS_FIND_ALL);

    if (usersCached) return JSON.parse(usersCached);

    const users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '123456',
        rol: 'USER',
        activities: ['COMPOSITOR', 'WRITER'],
        posts: [
          {
            id: 1,
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            title: 'Lorem ipsum dolor sit amet',
            publishDate: new Date(),
            visualMediaContent:
              'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
            reactions: [1, 2, 3],
            shared: [1, 2, 3],
            saved: [1, 2, 3],
          },
          {
            id: 2,
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            title: 'Lorem ipsum dolor sit amet',
            publishDate: new Date(),
            visualMediaContent:
              'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
            reactions: [1, 2, 3],
            shared: [1, 2, 3],
            saved: [1, 2, 3],
          },
        ],
        categories: [
          {
            id: 1,
            name: 'Category 1',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            subcategories: ['CLASSIC', 'ELECTRONIC', 'COMPOSITION'],
          },
        ],
      },
      {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '123456',
        rol: 'USER',
        activities: ['COMPOSITOR', 'WRITER'],
        posts: [
          {
            id: 1,
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            title: 'Lorem ipsum dolor sit amet',
            publishDate: new Date(),
            visualMediaContent:
              'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
            reactions: [1, 2, 3],
            shared: [1, 2, 3],
            saved: [1, 2, 3],
          },
          {
            id: 2,
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            title: 'Lorem ipsum dolor sit amet',
            publishDate: new Date(),
            visualMediaContent:
              'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
            reactions: [1, 2, 3],
            shared: [1, 2, 3],
            saved: [1, 2, 3],
          },
        ],
        categories: [
          {
            id: 1,
            name: 'Category 1',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            subcategories: ['CLASSIC', 'ELECTRONIC', 'COMPOSITION'],
          },
        ],
      },
    ];

    this.cacheManager.set(
      USERS_FIND_ALL,
      JSON.stringify(users),
      'EX',
      REDIS_TTL,
    );

    return users;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
