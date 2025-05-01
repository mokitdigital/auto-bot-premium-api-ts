import venomService from '../venom/client';
import { Response, Request } from 'express';

export async function getQrCode(req: Request, res: Response) {
  const qrCode = venomService.getQrCode();
  if (!qrCode) {
    res.status(404).send('QR Code ainda não foi gerado. Aguarde...');
  }
  res.send(`<img src="${qrCode}" alt="QR Code do Venom-Bot" />`);
};
