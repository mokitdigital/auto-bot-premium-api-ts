import knex from 'knex';
import knexConfig from '../../knexfile';
import { Request, Response } from 'express';

const db = knex(knexConfig.development);

// Criar um novo fluxo
export async function createFlow(req: Request, res: Response) {
  try {
    const { step, message, options, next_step } = req.body;

    if (!step || !message) {
      res
        .status(400)
        .json({ error: 'Os campos step e message são obrigatórios' });
    }

    const [newFlow] = await db('flows')
      .insert({
        step,
        message,
        options: options ? JSON.stringify(options) : null,
        next_step: next_step ?? null,
      })
      .returning('*');

    res.status(201).json(newFlow);
  } catch (error) {
    console.error('Erro ao criar fluxo:', error);
    res.status(500).json({ error: 'Erro ao criar fluxo' });
  }
};

// Buscar todos os fluxos
export async function getFlows(req: Request, res: Response) {
  try {
    const flows = await db('flows').select('*');
    res.json(flows);
  } catch (error) {
    console.error('Erro ao buscar fluxos:', error);
    res.status(500).json({ error: 'Erro ao buscar fluxos' });
  }
};

// Buscar um fluxo por ID
export async function getFlow(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const flow = await db('flows').where({ id }).first();

    if (!flow) {
      res.status(404).json({ error: 'Fluxo não encontrado' });
    }

    res.json(flow);
  } catch (error) {
    console.error('Erro ao buscar fluxo:', error);
    res.status(500).json({ error: 'Erro ao buscar fluxo' });
  }
};

// Atualizar um fluxo por ID
export async function updateFlow(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { step, message, options, next_step } = req.body;

    console.log(req.body);

    const updated = await db('flows').where({ id }).update({
      step,
      message,
      options: options ? JSON.stringify(options) : null,
      next_step: next_step ?? null,
      updated_at: db.fn.now(),
    });

    if (!updated) {
      res.status(404).json({ error: 'Fluxo não encontrado' });
    }

    res.json({ message: 'Fluxo atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar fluxo:', error);
    res.status(500).json({ error: 'Erro ao atualizar fluxo' });
  }
};

// Excluir um fluxo por ID
export async function deleteFlow(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await db('flows').where({ id }).del();

    if (!deleted) {
      res.status(404).json({ error: 'Fluxo não encontrado' });
    }

    res.json({ message: 'Fluxo excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir fluxo:', error);
    res.status(500).json({ error: 'Erro ao excluir fluxo' });
  }
};
