import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';


@Controller('products')
export class ProductsController {

	constructor(
		@Inject(PRODUCT_SERVICE) private readonly client: ClientProxy,
	) { }


	@Get()
	findAllProducts(@Query() paginationDto: PaginationDto) {
		return this.client.send({ cmd: 'findAllProducts' }, paginationDto)
			.pipe(
				catchError(error => { throw new RpcException(error) })
			)
	}


	@Get(':id')
	async findProductById(@Param('id', ParseIntPipe) id: number) {
		return this.client.send({ cmd: 'findOneProduct' }, { id })
			.pipe(
				catchError(error => { throw new RpcException(error) })
			)
		// try {
		// 	return await firstValueFrom(this.client.send({ cmd: 'findOneProduct' }, { id }))
		// } catch (error) {
		// 	throw new RpcException(error)
		// }
	}


	@Post()
	createProduct(@Body() createProductDto: CreateProductDto) {
		return this.client.send({ cmd: 'createProduct' }, createProductDto)
			.pipe(
				catchError(error => { throw new RpcException(error) })
			)
	}


	@Patch(':id')
	editProduct(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
		return this.client.send({ cmd: 'updateProduct' }, { id, ...updateProductDto })
			.pipe(
				catchError(error => { throw new RpcException(error) })
			)
	}


	@Delete(':id')
	deleteProduct(@Param('id', ParseIntPipe) id: number) {
		return this.client.send({ cmd: 'deleteProduct' }, { id })
			.pipe(
				catchError(error => { throw new RpcException(error) })
			)
	}
}
