/* eslint-disable @typescript-eslint/member-ordering */
// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseEvent, EventQueuer } from 'lisk-framework';
import { BadgeIncomeReclaimedEventData } from '../types';
import { BadgeIncomeReclaimedEventDataSchema } from '../schemas';

export class BadgeIncomeReclaimed extends BaseEvent<BadgeIncomeReclaimedEventData> {
  public schema = BadgeIncomeReclaimedEventDataSchema;

  public log(ctx: EventQueuer, data: BadgeIncomeReclaimedEventData): void {
    this.add(ctx, data, [
      data.address,
    ]);
  }
}
