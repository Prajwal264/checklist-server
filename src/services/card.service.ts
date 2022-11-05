/* eslint-disable no-param-reassign */
import { inject, injectable } from 'inversify';
import { generate } from 'shortid';
import TYPES from '../types';
import { ColumnService } from './column.service';

export interface ICard {
  title: string;
  checked: boolean;
  cardId: string;
}

export interface IMoveCardPayload {
  cardId: string;
  sourceParentId: string;
  destinationParent: string;
  referenceNodeId: string;
  isDroppedAbove: boolean;
}

@injectable()
export class CardService {
  constructor(
    @inject(TYPES.ColumnService) readonly columnService: ColumnService,
  ) { }

  async create(columnId: string, payload: {
    parentId?: string;
    previousElementId?: string;
    title: string
    checked: boolean
  }) {
    const cardId = `cardId_${generate()}`;
    const column = await this.columnService.fetchOne({ columnId });
    const newCard = {
      type: 'Card',
      cardId,
      title: payload.title,
      checked: payload.checked,
    };
    if (!column) {
      throw new Error('Column not found');
    }

    if (!payload.parentId) {
      if (!payload.previousElementId) {
        column.children.push(newCard);
      }
    }
    await column.save();
    return newCard;
  }

  async update({
    cardId,
    columnId,
  }: {
    cardId: string,
    columnId: string
  }, updateParams: Partial<ICard>) {
    const column = await this.columnService.fetchOne({ columnId });
    if (!column) {
      throw new Error('No Column found for the columnId');
    }
    column.children.forEach((child) => {
      if (child.cardId === cardId) {
        if (updateParams.title !== undefined) {
          child.title = updateParams.title;
        }
        if (updateParams.checked !== undefined) {
          child.checked = updateParams.checked;
        }
      }
    });
    column.markModified('children');
    await column.save();
    return {
      cardId,
      ...updateParams,
    };
  }

  async move(payload: IMoveCardPayload) {
    const sourceParentPromise = this
      .columnService.fetchOne({ columnId: payload.sourceParentId });
    const destinationParentPromise = this.columnService
      .fetchOne({ columnId: payload.destinationParent });
    const promises = [];
    promises.push(sourceParentPromise);
    if (payload.sourceParentId !== payload.destinationParent) {
      promises.push(destinationParentPromise);
    }
    const [sourceParent, destinationParent] = await Promise.all(promises);
    if (!sourceParent) {
      throw new Error('Source Parent not found');
    }
    const itemToBeMoved = sourceParent?.children
      .find((child) => child.cardId === payload.cardId);
    if (!itemToBeMoved) {
      throw new Error('Card not found');
    }

    sourceParent.children = sourceParent.children
      .filter((child) => child.cardId !== payload.cardId);
    if (payload.sourceParentId === payload.destinationParent) {
      let indexForMovement = sourceParent.children
        .findIndex((item) => item.cardId === payload.referenceNodeId);
      indexForMovement = payload.isDroppedAbove ? indexForMovement : indexForMovement + 1;
      sourceParent.children.splice(indexForMovement, 0, itemToBeMoved);
    } else {
      if (!destinationParent) {
        throw new Error('Destination parent not found');
      }
      let indexForMovement = destinationParent.children
        .findIndex((item) => item.cardId === payload.referenceNodeId);
      indexForMovement = payload.isDroppedAbove ? indexForMovement : indexForMovement + 1;
      destinationParent.children.splice(indexForMovement, 0, itemToBeMoved);
      await destinationParent.save();
    }
    await sourceParent.save();
  }

  async deleteOne(cardId: string, columnId: string) {
    const column = await this.columnService.fetchOne({
      columnId,
    });
    if (!column) {
      throw new Error(`Column with columnId: ${columnId} isn't found`);
    }
    column.children.forEach((card, index) => {
      if (card.cardId === cardId) {
        column.children.splice(index, 1);
      }
    });
    column.markModified('children');
    column.save();
    return true;
  }
}
