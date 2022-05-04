import dayjs from 'dayjs';
import * as Clipboard from 'expo-clipboard';
import numbro from 'numbro';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Caption,
  IconButton,
  Subheading,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { useQuery } from 'react-query';
import { showMessage } from 'react-native-flash-message';
import AutoComplete from './components/AutoComplete';
import Row from './components/Row';
import { fetchCurrencies, fetchRates, fetchSymbols } from './utils/api';

type FormData = {
  amount: string;
  symbol: string;
  currency: string;
  target: string;
};

const initialValues: FormData = {
  amount: '1',
  symbol: 'BTC',
  target: 'ETH',
  currency: 'USD',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 32,
  },
  flex: {
    flex: 1,
  },
  input: {
    flex: 7,
    marginRight: 16,
  },
  centerText: {
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    padding: 8,
  },
});

const Home: React.FC = () => {
  const { colors } = useTheme();

  const form = useForm<FormData>({
    defaultValues: initialValues,
  });
  const { control, watch, setValue, reset } = form;
  const watchAmount = watch('amount');
  const watchSymbol = watch('symbol');
  const watchTarget = watch('target');
  const watchCurrency = watch('currency');

  const [focus, setFocus] = useState<'symbol' | 'target' | 'currency'>(
    'symbol',
  );

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    showMessage({ message: `Copied ${text} to clipboard`, type: 'success' });
  };

  const focusedSymbol = useMemo(() => {
    switch (focus) {
      case 'currency':
        return watchCurrency;
      case 'target':
        return watchTarget;
      case 'symbol':
      default:
        return watchSymbol;
    }
  }, [focus, watchCurrency, watchTarget, watchSymbol]);

  useEffect(() => {
    setValue('amount', '1');
  }, [focusedSymbol, setValue]);

  const { data: symbols } = useQuery('symbols', fetchSymbols);
  const { data: currencies } = useQuery('currencies', fetchCurrencies);
  const {
    data: rates,
    refetch,
    dataUpdatedAt,
    isLoading,
  } = useQuery(['rates', focusedSymbol], () => fetchRates(focusedSymbol));

  const symbolsOptions = useMemo(() => {
    if (!symbols) return [];

    return symbols.map((symbol) => ({
      label: symbol,
      value: symbol,
    }));
  }, [symbols]);

  const currenciesOptions = useMemo(() => {
    if (!currencies) return [];

    return currencies.map((currency) => ({
      label: currency,
      value: currency,
    }));
  }, [currencies]);

  const getConvertedAmount = useCallback(
    (value: string, symbol: string) =>
      numbro(Number(value) * Number(rates?.[symbol] || '0')).format({
        thousandSeparated: true,
      }),
    [rates],
  );

  const swapSymbols = () => {
    setValue('symbol', watchTarget);
    setValue('target', watchSymbol);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={isLoading}
            onRefresh={refetch}
          />
        }>
        <Row>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onBlur, onChange, value } }) => (
              <TextInput
                style={styles.input}
                mode="outlined"
                autoComplete={false}
                value={
                  focus === 'symbol'
                    ? value
                    : getConvertedAmount(watchAmount, watchSymbol)
                }
                onChangeText={onChange}
                onBlur={onBlur}
                label="Amount"
                keyboardType="numeric"
                onFocus={() => setFocus('symbol')}
              />
            )}
          />
          <Controller
            control={control}
            name="symbol"
            render={({ field: { onChange } }) => (
              <View style={styles.flex}>
                <AutoComplete
                  label="Select Symbol"
                  selected={watchSymbol}
                  options={symbolsOptions}
                  onSelect={onChange}>
                  <Subheading style={styles.centerText}>
                    {watchSymbol}
                  </Subheading>
                </AutoComplete>
              </View>
            )}
          />
          <IconButton
            icon="md-copy-outline"
            color={colors.primary}
            onPress={() =>
              copyToClipboard(
                focus === 'symbol'
                  ? watchAmount
                  : getConvertedAmount(watchAmount, watchSymbol),
              )
            }
          />
        </Row>
        <Row>
          <View style={styles.input} />
          <View style={[styles.flex, { alignItems: 'center' }]}>
            <IconButton
              onPress={swapSymbols}
              color={colors.text}
              icon="swap-vertical"
            />
          </View>
          <View style={styles.flex} />
        </Row>
        <Row>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onBlur, onChange, value } }) => (
              <TextInput
                style={styles.input}
                mode="outlined"
                autoComplete={false}
                value={
                  focus === 'target'
                    ? value
                    : getConvertedAmount(watchAmount, watchTarget)
                }
                onChangeText={onChange}
                onBlur={onBlur}
                label="Amount"
                keyboardType="numeric"
                onFocus={() => setFocus('target')}
              />
            )}
          />
          <Controller
            control={control}
            name="target"
            render={({ field: { onChange } }) => (
              <View style={styles.flex}>
                <AutoComplete
                  label="Select Coin"
                  selected={watchTarget}
                  options={symbolsOptions}
                  onSelect={onChange}>
                  <Subheading style={styles.centerText}>
                    {watchTarget}
                  </Subheading>
                </AutoComplete>
              </View>
            )}
          />
          <IconButton
            icon="md-copy-outline"
            color={colors.primary}
            onPress={() =>
              copyToClipboard(
                focus === 'target'
                  ? watchAmount
                  : getConvertedAmount(watchAmount, watchTarget),
              )
            }
          />
        </Row>
        <Row>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onBlur, onChange, value } }) => (
              <TextInput
                style={styles.input}
                mode="outlined"
                autoComplete={false}
                value={
                  focus === 'currency'
                    ? value
                    : getConvertedAmount(watchAmount, watchCurrency)
                }
                onChangeText={onChange}
                onBlur={onBlur}
                label="Amount"
                keyboardType="numeric"
                onFocus={() => setFocus('currency')}
              />
            )}
          />
          <Controller
            control={control}
            name="currency"
            render={({ field: { onChange } }) => (
              <View style={styles.flex}>
                <AutoComplete
                  label="Select Currency"
                  selected={watchCurrency}
                  options={currenciesOptions}
                  onSelect={onChange}>
                  <Subheading style={styles.centerText}>
                    {watchCurrency}
                  </Subheading>
                </AutoComplete>
              </View>
            )}
          />
          <IconButton
            icon="md-copy-outline"
            color={colors.primary}
            onPress={() =>
              copyToClipboard(
                focus === 'currency'
                  ? watchAmount
                  : getConvertedAmount(watchAmount, watchCurrency),
              )
            }
          />
        </Row>
      </ScrollView>
      <Caption style={styles.centerText}>
        Last updated: {dayjs(dataUpdatedAt).format('MMMM D h:mm:ss A')}
      </Caption>
      <Button
        onPress={() => {
          reset(initialValues);
        }}
        mode="contained"
        style={styles.button}>
        Reset
      </Button>
    </View>
  );
};

export default Home;
