import { Controller, Get, Post, Body, Patch, Param, Inject, Query, ParseUUIDPipe } from '@nestjs/common';
import { ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { OrderStatus } from './enum/order.enum';
import { PaginationDto } from 'src/common';


@Controller('orders')
export class OrdersController {

  constructor(
    @Inject(ORDER_SERVICE) private readonly orderClient: ClientProxy,
  ) { }


  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      const a = await firstValueFrom(this.orderClient.send('createOrder', createOrderDto))
      return a
    } catch (error) {
      throw new RpcException(error)
    }

  }


  @Get()
  findAllOrders(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.orderClient.send('findAllOrders', orderPaginationDto)
      .pipe(
        catchError(error => { throw new RpcException(error) })
      )
  }

  @Get(':status')
  async findAllByStatus(@Param() statusDto: StatusDto, @Query() paginationDto: PaginationDto) {
    return this.orderClient.send('findAllOrders', { ...paginationDto, status: statusDto.status })
      .pipe(
        catchError(error => { throw new RpcException(error) })
      )
  }


  @Get('id/:id')
  async findOrderById(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderClient.send('findOneOrderById', { id })
      .pipe(
        catchError(error => { throw new RpcException(error) })
      )
  }

  @Patch(':id')
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto
  ) {
    return this.orderClient.send('changeOrderStatus', { ...statusDto, id })
      .pipe(
        catchError(error => { throw new RpcException(error) })
      )
  }
}