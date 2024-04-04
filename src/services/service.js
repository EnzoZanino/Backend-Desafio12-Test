import CartServiceDao from "./dao/carts.service.js";
import ProductServiceDao from "./dao/products.service.js";
import UserServiceDao from "./dao/users.service.js";
import messageServiceDao from "./dao/messages.service.js";
import ticketServiceDao from "./dao/ticket.service.js";

import CartsRepository from "./repository/carts.repository.js";
import ProductsRepository from "./repository/products.repository.js";
import UsersRepository from "./repository/users.repository.js";
import MessageRepository from "./repository/messages.repository.js";
import TicketsRepository from "./repository/tickets.repository.js";

//Classes instance
const cartsDao = new CartServiceDao();
const productsDao = new ProductServiceDao();
const usersDao = new UserServiceDao();
const messagesDao = new messageServiceDao();
const ticketsDao = new ticketServiceDao();

export const cartService = new CartsRepository(cartsDao);
export const productsService = new ProductsRepository(productsDao);
export const usersService = new UsersRepository(usersDao);
export const messagesService = new MessageRepository(messagesDao);
export const ticketsService = new TicketsRepository(ticketsDao);
