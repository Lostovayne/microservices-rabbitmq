import { Body, Controller, Get, Post } from '@nestjs/common';
import type { CreateOrderRequest } from './dto/create-order.request';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() request: CreateOrderRequest) {
    return await this.ordersService.createOrder(request);
  }

  @Get()
  async getOrders() {
    return await this.ordersService.getOrders();
  }
}
