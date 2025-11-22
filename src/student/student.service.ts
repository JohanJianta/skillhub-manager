import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private repo: Repository<Student>,
  ) {}

  // Find all (exclude deleted)
  async findAll() {
    return this.repo.find({
      where: { is_deleted: false },
      order: { id: 'ASC' },
    });
  }

  // Find one (exclude deleted)
  async findOne(id: number) {
    const student = await this.repo.findOne({
      where: { id, is_deleted: false },
    });

    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }

    return student;
  }

  // Create student
  async create(dto: CreateStudentDto) {
    // Check duplicate email
    const existing = await this.repo.findOne({
      where: { email: dto.email, is_deleted: false },
    });

    if (existing) {
      throw new ConflictException(
        `Student with email ${dto.email} already exists`,
      );
    }

    const student = this.repo.create(dto);
    return this.repo.save(student);
  }

  // Update student
  async update(id: number, dto: UpdateStudentDto) {
    const student = await this.repo.findOne({
      where: { id, is_deleted: false },
    });

    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }

    // Check if new email is already used
    if (dto.email && dto.email !== student.email) {
      const emailExists = await this.repo.findOne({
        where: { email: dto.email, is_deleted: false },
      });

      if (emailExists) {
        throw new ConflictException(
          `Another student with email ${dto.email} already exists`,
        );
      }
    }

    Object.assign(student, dto);
    return this.repo.save(student);
  }

  // Soft delete
  async delete(id: number) {
    const student = await this.repo.findOne({
      where: { id, is_deleted: false },
    });

    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }

    student.is_deleted = true;
    await this.repo.save(student);
    return;
  }
}
