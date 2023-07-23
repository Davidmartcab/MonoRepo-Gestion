import { Injectable } from '@nestjs/common';
import { Deudas, ItemListItem } from './models/models';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  public calcularDeudas(data: ItemListItem[]): Deudas {
    const deudas: Deudas = {};

    // Recorre los objetos de datos
    data.forEach((obj) => {
      const { payer, amount, debtors } = obj;
      const amountPorPersona = amount / debtors.length; // Divide la amount entre los debtors

      // Registra las deudas para los debtors
      debtors.forEach((moroso) => {
        if (!deudas[moroso]) {
          deudas[moroso] = {};
        }
        if (moroso !== payer) {
          if (!deudas[moroso][payer]) {
            deudas[moroso][payer] = amountPorPersona; // Registra la deuda con el payer
          } else {
            deudas[moroso][payer] += amountPorPersona; // Incrementa la deuda existente con el payer
          }

          // Si hay una deuda mutua, se reduce
          if (deudas[payer] && deudas[payer][moroso]) {
            const minDeuda = Math.min(
              deudas[moroso][payer],
              deudas[payer][moroso],
            );
            deudas[moroso][payer] -= minDeuda;
            deudas[payer][moroso] -= minDeuda;
          }
        }
      });
    });

    // Realiza la conversión y redondeo de las deudas
    for (const persona in deudas) {
      for (const deudor in deudas[persona]) {
        const amount = deudas[persona][deudor];
        deudas[persona][deudor] = this.redondearDecimales(Math.abs(amount));
      }
    }

    // Elimina las deudas con valor 0
    for (const persona in deudas) {
      for (const deudor in deudas[persona]) {
        if (deudas[persona][deudor] === 0) {
          delete deudas[persona][deudor];
        }
      }
    }

    // Elimina las personas sin deudas
    for (const persona in deudas) {
      if (Object.keys(deudas[persona]).length === 0) {
        delete deudas[persona];
      }
    }

    return deudas;
  }

  private redondearDecimales(numero: number): number {
    // Implementación de la función redondearDecimales
    // Puedes definir tu propia lógica para redondear los números a la amount de decimales que necesitas.
    // Por ejemplo, si quieres redondear a 2 decimales, podrías usar:
    return Math.round(numero * 100) / 100;
  }

  public generateRandomUUID(length) {
    // Generate a random UUID
    const randomUUID = uuidv4();
  
    // Truncate the UUID to the desired length
    const truncatedUUID = randomUUID.replace(/-/g, '').slice(0, length);
  
    return truncatedUUID;
  }
}
