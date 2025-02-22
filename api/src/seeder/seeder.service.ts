import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/core/schemas/user.schema';
import { faker } from '@faker-js/faker';
import { Image } from 'src/schemas/image.schema';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Image.name) private readonly imageModel: Model<Image>,
  ) {}

  randomInt(max: number, min: number = 0) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async seed() {
    console.log('Seeding commenced');

    console.log('Vacating collections:');
    process.stdout.write('Removing users...');
    await this.userModel
      .deleteMany()
      .then(() => console.log('done'))
      .catch(() => console.log('skipped'));
    process.stdout.write('Removing images...');
    await this.imageModel
      .deleteMany()
      .then(() => console.log('done'))
      .catch(() => console.log('skipped'));

    try {
      console.log('Creating sample documents:');
      process.stdout.write('Creating users...');
      const users = await this.userModel.create(
        {
          username: 'admin',
          password: '1111',
          displayName: 'John Doe',
          avatarUrl: faker.image.personPortrait({ sex: 'male' }),
          role: 'admin',
        },
        {
          username: 'fantastic',
          password: '2222',
          displayName: 'Jane Doe',
          avatarUrl: faker.image.personPortrait({ sex: 'female' }),
        },
        {
          username: 'doting',
          password: '3333',
          displayName: 'Taylor Hebert',
          avatarUrl: faker.image.personPortrait({ sex: 'female' }),
        },
        {
          username: 'amused',
          password: '4444',
          displayName: 'Dorian Gray',
          avatarUrl: faker.image.personPortrait({ sex: 'male' }),
        },
      );
      console.log('done');

      process.stdout.write('Adding images...');
      await this.imageModel.create(
        Array.from({ length: 21 }).map((_, i) => ({
          user: users[this.randomInt(3)],
          title: faker.book.title(),
          image: `/uploads/fixtures/image-${i + 1}.jpg`,
        })),
      );
      console.log('done');

      console.log('Seeding completed');
    } catch (e) {
      console.error(e);
    }
  }
}
