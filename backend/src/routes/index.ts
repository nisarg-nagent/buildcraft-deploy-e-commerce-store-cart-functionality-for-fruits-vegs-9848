import type { FastifyInstance } from 'fastify';
import healthRoutes from './health.js';
import { prisma } from '../config/database.js';

async function getDemoUser() {
  return prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      password: 'demo123',
      name: 'Demo Admin',
      role: 'admin',
    },
  });
}

/** Registers all HTTP API plugins (health + feature routes). */
export async function registerRoutes(app: FastifyInstance): Promise<void> {
  await app.register(healthRoutes, { prefix: '/api' });

  app.post('/api/auth/login', async (request, reply) => {
    const body = request.body as { email?: string; password?: string };

    if (!body.email || !body.password) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' },
      });
    }

    let user = await prisma.user.findUnique({ where: { email: body.email } });

    if (!user && body.email === 'demo@example.com') {
      user = await prisma.user.create({
        data: {
          email: 'demo@example.com',
          password: 'demo123',
          name: 'Demo Admin',
          role: 'admin',
        },
      });
    }

    if (!user || user.password !== body.password) {
      return reply.status(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' },
      });
    }

    const token = app.jwt.sign({ sub: user.id, email: user.email, role: user.role });

    return {
      success: true,
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
    };
  });

  app.get('/api/products', async () => {
    const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });

    return {
      success: true,
      data: products.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: `$${product.price.toFixed(2)}/${product.unit}`,
        stock: product.stock,
        status: product.status,
        accent: product.accent,
      })),
    };
  });

  app.post('/api/products', async (request, reply) => {
    const body = request.body as {
      name?: string;
      category?: string;
      price?: number;
      unit?: string;
      stock?: number;
      status?: string;
      accent?: string;
    };

    if (!body.name || !body.category || typeof body.price !== 'number' || !body.unit) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Name, category, price, and unit are required' },
      });
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        category: body.category,
        price: body.price,
        unit: body.unit,
        stock: body.stock ?? 0,
        status: body.status ?? 'active',
        accent: body.accent ?? '#22c55e',
      },
    });

    return { success: true, data: product };
  });

  app.get('/api/cart', async () => {
    const user = await getDemoUser();
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
      orderBy: { createdAt: 'asc' },
    });

    return {
      success: true,
      data: {
        items: cartItems.map((item) => ({
          id: item.id,
          productId: item.productId,
          name: item.product.name,
          qty: item.quantity,
          price: item.product.price,
          unit: item.product.unit,
        })),
      },
    };
  });

  app.post('/api/cart/items', async (request, reply) => {
    const body = request.body as { productId?: string; quantity?: number };
    const user = await getDemoUser();

    if (!body.productId || typeof body.quantity !== 'number') {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Product and quantity are required' },
      });
    }

    const cartItem = await prisma.cartItem.upsert({
      where: { userId_productId: { userId: user.id, productId: body.productId } },
      update: { quantity: body.quantity },
      create: { userId: user.id, productId: body.productId, quantity: body.quantity },
      include: { product: true },
    });

    return {
      success: true,
      data: {
        id: cartItem.id,
        productId: cartItem.productId,
        name: cartItem.product.name,
        qty: cartItem.quantity,
        price: cartItem.product.price,
        unit: cartItem.product.unit,
      },
    };
  });

  app.get('/api/orders', async () => {
    const orders = await prisma.order.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: orders.map((order) => ({
        id: order.orderNumber,
        customer: order.user.name || order.user.email,
        total: `$${order.total.toFixed(2)}`,
        status: order.status.toLowerCase(),
        date: order.createdAt.toISOString().slice(0, 10),
      })),
    };
  });
}
