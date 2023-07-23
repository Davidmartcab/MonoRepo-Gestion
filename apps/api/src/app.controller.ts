import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ItemBody, ItemListItem, ResponseType } from './models/models';
import { Item, ItemDocument, ItemSchema } from './models/items.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './services/auth/auth.service';
import { HashService } from './services/hash/hash.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
    private readonly _auth: AuthService,
    private readonly _hash: HashService
  ) {}

  @Get()
  async get(@Req() req): Promise<ResponseType> {
    const token = await this._auth.generateToken(uuidv4());
    let response: ResponseType = {
      message: 'Api is running!',
      validationToken: token,
    };
    return response;
  }

  @Post('create')
  async create(@Body() body, @Req() req): Promise<ResponseType> {
    const validationToken = req.headers.validationtoken;
    try {
      await this._auth.validateTokenAndGetCode(validationToken as string);
    } catch (error) {
      return { message: 'Invalid token!' };
    }

    const { names, password } = body;
    if (!names || names.length < 2) return { message: 'Invalid names!' };

    const hashedPassword = await this._hash.hashPassword(password);

    let code = this.appService.generateRandomUUID(6);

    let validated = false;
    while (!validated) {
      const item = await this.itemModel.findOne({ code }).exec();
      !item
        ? (validated = true)
        : (code = this.appService.generateRandomUUID(6));
    }

    const newItem = new this.itemModel({
      code,
      password: hashedPassword,
      names,
      items: [],
    });
    const savedItem = await newItem.save();

    const token = await this._auth.generateToken(savedItem.code);

    let response: ResponseType = {
      message: 'Created!',
      data: savedItem.names,
      token,
      code,
    };
    return response;
  }

  @Post('connect')
  async connect(@Req() req): Promise<ResponseType> {
    const { code } = req.headers;
    const validationToken = req.headers.validationtoken;
    try {
      await this._auth.validateTokenAndGetCode(validationToken as string);
    } catch (error) {
      return { message: 'Invalid token!' };
    }

    try {
      const item = await this.itemModel.findOne({ code }).exec();

      if (!item) throw new NotFoundException('Item not found!');

      const names = item.names;
      const newToken = await this._auth.generateToken(item.code);
      let response: ResponseType = {
        message: 'Connected!',
        data: names,
        token: newToken,
        code,
      };

      return response;
    } catch (error) {
      let response: ResponseType = {
        message: 'Error occurred while connecting!',
      };

      return response;
    }
  }

  @Get('names')
  async getNames(@Req() req): Promise<ResponseType> {
    const { token } = req.headers;
    let code: string;
    try {
      code = await this._auth.validateTokenAndGetCode(token as string);
    } catch (error) {
      return { message: 'Invalid token!' };
    }

    try {
      const item = await this.itemModel.findOne({ code }).exec();

      if (!item) {
        throw new NotFoundException('Item not found!');
      }

      const names = item.names;
      const newToken = await this._auth.generateToken(item.code);
      let response: ResponseType = {
        message: 'Names found!',
        data: names,
        token: newToken,
      };

      return response;
    } catch (error) {
      let response: ResponseType = {
        message: 'Error occurred while getting names!',
      };

      return response;
    }
  }

  @Get('items')
  async getItems(@Req() req): Promise<ResponseType> {
    const { token } = req.headers;
    let code: string;
    try {
      code = await this._auth.validateTokenAndGetCode(token as string);
    } catch (error) {
      return { message: 'Invalid token!' };
    }

    try {
      const item = await this.itemModel.findOne({ code }).exec();

      if (!item) {
        throw new NotFoundException('Item not found!');
      }

      const itemsList: ItemListItem[] = item.items.map((itemObj) => ({
        uuid: itemObj.uuid,
        title: itemObj.title,
        payer: itemObj.payer,
        amount: itemObj.amount,
        debtors: itemObj.debtors,
        createdAt: itemObj.createdAt,
      }));
      const deudas = this.appService.calcularDeudas(itemsList);

      const newToken = await this._auth.generateToken(item.code);

      let response: ResponseType = {
        message: 'Items found!',
        data: {
          itemsList,
          deudas,
        },
        token: newToken,
      };

      return response;
    } catch (error) {
      let response: ResponseType = {
        message: 'Error occurred while getting items!',
      };

      return response;
    }
  }

  @Post('items')
  async postItems(@Body() body: ItemBody, @Req() req): Promise<ResponseType> {
    const { token } = req.headers;
    let code: string;
    try {
      code = await this._auth.validateTokenAndGetCode(token as string);
    } catch (error) {
      return { message: 'Invalid token!' };
    }

    try {
      const item = await this.itemModel.findOne({ code }).exec();
      if (!item) {
        throw new NotFoundException('Item not found!');
      }

      const newItem: ItemListItem = {
        uuid: uuidv4(),
        title: body.title,
        payer: body.payer,
        amount: body.amount,
        debtors: body.debtors,
        createdAt: new Date(),
      };
      item.items.push(newItem);
      const savedItem = await item.save();

      const newToken = await this._auth.generateToken(savedItem.code);

      let response: ResponseType = {
        message: 'Item added!',
        token: newToken,
      };

      return response;
    } catch (error) {
      let response: ResponseType = {
        message: 'Error occurred while adding the item!',
      };

      return response;
    }
  }
}
