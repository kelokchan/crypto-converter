import axios from 'axios';

const BINANCE_BASE_URL = 'https://api.binance.com/api/v3';
const COINBASE_BASE_URL = 'https://api.coinbase.com/v2';

export const fetchSymbols = async (): Promise<string[]> => {
  const { data } = await axios.get(`${BINANCE_BASE_URL}/exchangeInfo`);
  return [
    ...new Set(
      data.symbols.map(
        ({ baseAsset }: { baseAsset: string }) => baseAsset,
      ) as string[],
    ),
  ];
};

export const fetchCurrencies = async (): Promise<string[]> => {
  const { data: resp } = await axios.get(`${COINBASE_BASE_URL}/currencies`);
  const { data } = resp;

  return data.map(({ id }: { id: string }) => id);
};

export const fetchRates = async (
  currency: string,
): Promise<Record<string, string>> => {
  const { data: resp } = await axios.get(
    `${COINBASE_BASE_URL}/exchange-rates`,
    {
      params: {
        currency,
      },
    },
  );

  const { data } = resp;

  return data.rates;
};
