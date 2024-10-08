import { Controller, Get, Post, Body, Patch, Param, Inject, Query, ParseUUIDPipe } from '@nestjs/common';
import { ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { OrderStatus } from './enum/order.enum';
import { PaginationDto } from 'src/common';


@Controller('orders')
export class OrdersController {

  constructor(
    @Inject(ORDER_SERVICE) private readonly client: ClientProxy,
  ) { }


  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto)
      .pipe(
        catchError(error => { throw new RpcException(error) })
      )
  }


  @Get()
  findAllOrders(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.client.send('findAllOrders', orderPaginationDto)
      .pipe(
        catchError(error => { throw new RpcException(error) })
      )
  }

  @Get(':status')
  async findAllByStatus(@Param() statusDto: StatusDto, @Query() paginationDto: PaginationDto) {
    return this.client.send('findAllOrders', { ...paginationDto, status: statusDto.status })
      .pipe(
        catchError(error => { throw new RpcException(error) })
      )
  }


  @Get('id/:id')
  async findOrderById(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('findOneOrderById', { id })
      .pipe(
        catchError(error => { throw new RpcException(error) })
      )
  }

  @Patch(':id')
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto
  ) {
    return this.client.send('changeOrderStatus', { ...statusDto, id })
      .pipe(
        catchError(error => { throw new RpcException(error) })
      )
  }
}