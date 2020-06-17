import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction does not exist!');
    }

    const { total } = await transactionsRepository.getBalance();

    if (transaction.type === 'income' && total < transaction.value) {
      throw new AppError('Your balance will be negative.');
    }

    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
