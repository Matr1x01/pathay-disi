import { Injectable } from '@nestjs/common';
import getPackageDict from './common/utils/getPackageDict';

@Injectable()
export class AppService {
  getPackageTypes() {
    return Object.entries(getPackageDict()).map(([value, data]) => ({
      value,
      label: data.label,
    }));
  }

  getPackageCost() {
    return Object.entries(getPackageDict()).map(([value, data]) => ({
      value,
      cost: data.cost,
    }));
  }

  getWeightOptions() {
    return [
      { value: 1, label: 'Up to 1 kg', cost: 60 },
      { value: 2, label: '1–3 kg', cost: 90 },
      { value: 3, label: '3–5 kg', cost: 120 },
    ];
  }

  getPaymentMethods() {
    return [
      { value: 'bkash', label: 'bKash', icon: '📱' },
      { value: 'nagad', label: 'Nagad', icon: '💚' },
      { value: 'card', label: 'Card', icon: '💳' },
      { value: 'pay_on_pickup', label: 'Pay on Pickup', icon: '💵' },
    ];
  }
}
