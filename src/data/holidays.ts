import { NationalHoliday } from '../types';

export const INDONESIAN_HOLIDAYS_2026: NationalHoliday[] = [
  { date: '2026-01-01', name: 'Tahun Baru Masehi' },
  { date: '2026-02-17', name: 'Isra Mi\'raj Nabi Muhammad SAW' },
  { date: '2026-02-18', name: 'Tahun Baru Imlek 2577 Kongzili' },
  { date: '2026-03-20', name: 'Hari Suci Nyepi (Tahun Baru Saka 1948)' },
  { date: '2026-03-21', name: 'Hari Raya Idul Fitri 1447 H' },
  { date: '2026-03-22', name: 'Hari Raya Idul Fitri 1447 H' },
  { date: '2026-04-03', name: 'Wafat Yesus Kristus (Jumat Agung)' },
  { date: '2026-04-05', name: 'Hari Paskah' },
  { date: '2026-05-01', name: 'Hari Buruh Internasional' },
  { date: '2026-05-14', name: 'Kenaikan Yesus Kristus' },
  { date: '2026-05-27', name: 'Hari Raya Waisak 2570 BE' },
  { date: '2026-05-28', name: 'Hari Raya Idul Adha 1447 H' },
  { date: '2026-06-01', name: 'Hari Lahir Pancasila' },
  { date: '2026-06-18', name: 'Tahun Baru Islam 1448 H' },
  { date: '2026-08-17', name: 'Hari Kemerdekaan Republik Indonesia' },
  { date: '2026-08-27', name: 'Maulid Nabi Muhammad SAW' },
  { date: '2026-12-25', name: 'Hari Raya Natal' }
];

export const INDONESIAN_HOLIDAYS_2027: NationalHoliday[] = [
  { date: '2027-01-01', name: 'Tahun Baru Masehi' },
  { date: '2027-02-06', name: 'Isra Mi\'raj Nabi Muhammad SAW' },
  { date: '2027-02-07', name: 'Tahun Baru Imlek 2578 Kongzili' },
  { date: '2027-03-09', name: 'Hari Suci Nyepi (Tahun Baru Saka 1949)' },
  { date: '2027-03-10', name: 'Hari Raya Idul Fitri 1448 H' },
  { date: '2027-03-11', name: 'Hari Raya Idul Fitri 1448 H' },
  { date: '2027-03-26', name: 'Wafat Yesus Kristus' },
  { date: '2027-03-28', name: 'Hari Paskah' },
  { date: '2027-05-01', name: 'Hari Buruh Internasional' },
  { date: '2027-05-06', name: 'Kenaikan Yesus Kristus' },
  { date: '2027-05-17', name: 'Hari Raya Idul Adha 1448 H' },
  { date: '2027-05-20', name: 'Hari Raya Waisak 2571 BE' },
  { date: '2027-06-01', name: 'Hari Lahir Pancasila' },
  { date: '2027-06-07', name: 'Tahun Baru Islam 1449 H' },
  { date: '2027-08-17', name: 'Hari Kemerdekaan Republik Indonesia' },
  { date: '2027-08-16', name: 'Maulid Nabi Muhammad SAW' },
  { date: '2027-12-25', name: 'Hari Raya Natal' }
];

export const INDONESIAN_HOLIDAYS_2028: NationalHoliday[] = [
  { date: '2028-01-01', name: 'Tahun Baru Masehi' },
  { date: '2028-01-26', name: 'Isra Mi\'raj Nabi Muhammad SAW' },
  { date: '2028-01-27', name: 'Tahun Baru Imlek 2579 Kongzili' },
  { date: '2028-03-18', name: 'Hari Raya Idul Fitri 1449 H' },
  { date: '2028-03-19', name: 'Hari Raya Idul Fitri 1449 H' },
  { date: '2028-03-26', name: 'Hari Suci Nyepi (Tahun Baru Saka 1950)' },
  { date: '2028-04-14', name: 'Wafat Yesus Kristus (Jumat Agung)' },
  { date: '2028-04-16', name: 'Hari Paskah' },
  { date: '2028-05-01', name: 'Hari Buruh Internasional' },
  { date: '2028-05-09', name: 'Hari Raya Waisak 2572 BE' },
  { date: '2028-05-25', name: 'Kenaikan Yesus Kristus' },
  { date: '2028-06-01', name: 'Hari Lahir Pancasila' },
  { date: '2028-06-03', name: 'Hari Raya Idul Adha 1449 H' },
  { date: '2028-06-24', name: 'Tahun Baru Islam 1450 H' },
  { date: '2028-08-17', name: 'Hari Kemerdekaan Republik Indonesia' },
  { date: '2028-09-02', name: 'Maulid Nabi Muhammad SAW' },
  { date: '2028-12-25', name: 'Hari Raya Natal' }
];

export function getNationalHolidays(year: number): NationalHoliday[] {
  if (year === 2026) return INDONESIAN_HOLIDAYS_2026;
  if (year === 2027) return INDONESIAN_HOLIDAYS_2027;
  if (year === 2028) return INDONESIAN_HOLIDAYS_2028;
  // Dynamic generation for other years as fallback
  return [
    { date: `${year}-01-01`, name: 'Tahun Baru Masehi' },
    { date: `${year}-05-01`, name: 'Hari Buruh Internasional' },
    { date: `${year}-06-01`, name: 'Hari Lahir Pancasila' },
    { date: `${year}-08-17`, name: 'Hari Kemerdekaan Republik Indonesia' },
    { date: `${year}-12-25`, name: 'Hari Raya Natal' }
  ];
}
