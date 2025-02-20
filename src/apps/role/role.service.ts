import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'src/entities/roles.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Roles) private readonly rolesRepository: Repository<Roles>) {}
}
