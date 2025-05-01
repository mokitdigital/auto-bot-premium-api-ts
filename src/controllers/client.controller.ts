import { Request, Response } from 'express';
import knex from 'knex';
import knexConfig from '../../knexfile';

const db = knex(knexConfig.development);

export async function getClients(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const [total] = await db('clients').count({ count: '*' });
    const totalCount = Number(total.count);

    const clients = await db('clients')
      .select('*')
      .limit(limit)
      .offset(offset)
      .orderBy('created_at', 'desc'); // Se tiver esse campo

    res.json({
      data: clients,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      }
    });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).send('Erro ao buscar clientes');
  }
};


export async function createClient(req: Request, res: Response) {
  try {
    const { name, phone } = req.body;
    const picture = "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200";
    const existingClient = await db('clients')
      .where({ phone })
      .first();
    if (existingClient) {
      res.status(400).json({ error: 'Cliente ja cadastrado' });
    }
    const [newClient] = await db('clients')
      .insert({ name, phone, picture })
      .returning('*');
    res.status(201).json(newClient);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
};
