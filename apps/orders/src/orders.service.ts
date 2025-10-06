import { Injectable } from '@nestjs/common';
import { CreateOrderRequest } from './dto/create-order.request';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async createOrder(request: CreateOrderRequest) {
    const order = await this.ordersRepository.create(request);
    return order;
  }

  async getOrders() {
    return await this.ordersRepository.find({});
  }
}
