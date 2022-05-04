/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-wrap-multilines */
import { Ionicons } from '@expo/vector-icons';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { FlatList, Keyboard, SafeAreaView } from 'react-native';
import Modal from 'react-native-modal';
import {
  Divider,
  IconButton,
  List,
  Searchbar,
  Subheading,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';

const AutoComplete: React.FC<{
  options: {
    label: string;
    value: string;
  }[];
  label: string;
  selected: string;
  disabled?: boolean;
  onEndReached?: () => void;
  loadOptions?: () => void;
  onSelect: (val: string) => void;
}> = (props) => {
  const { colors } = useTheme();
  const {
    label,
    options,
    disabled,
    onEndReached,
    children,
    selected,
    onSelect: onSelectProp,
  } = props;
  const [searchValue, setSearchValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    if (searchValue.trim()) {
      setFilteredOptions(
        [...options].filter(
          (option) =>
            // eslint-disable-next-line operator-linebreak
            option.label.toLowerCase().indexOf(searchValue.toLowerCase()) !==
            -1,
        ),
      );
    } else {
      setFilteredOptions([...options]);
    }
  }, [searchValue, options]);

  const onSelect = useCallback(
    (value) => {
      onSelectProp(value);
      setShowDropdown(false);
    },
    [onSelectProp],
  );

  const onPress = useCallback(() => {
    if (disabled) return;

    setFilteredOptions([]);
    setTimeout(() => {
      setFilteredOptions([...options]);
    }, 300);
    Keyboard.dismiss();
    setShowDropdown(true);
  }, [disabled, options]);

  const renderItem = React.useCallback(
    ({ item }) => {
      const isSelected = selected === item.value;

      return (
        <Fragment key={item.value}>
          <List.Item
            right={() =>
              isSelected && (
                <Ionicons name="checkmark" size={24} color={colors.primary} />
              )
            }
            onPress={() => onSelect(item.value)}
            titleNumberOfLines={2}
            title={
              <Subheading
                style={{
                  fontWeight: isSelected ? '500' : '400',
                  color: isSelected ? colors.primary : colors.text,
                }}>
                {item.label}
              </Subheading>
            }
          />
          <Divider />
        </Fragment>
      );
    },
    [colors.primary, colors.text, onSelect, selected],
  );

  return (
    <>
      <TouchableRipple
        disabled={disabled}
        onPress={onPress}
        rippleColor="transparent">
        {children}
      </TouchableRipple>
      <Modal
        isVisible={showDropdown}
        style={{ margin: 0 }}
        swipeDirection="down"
        propagateSwipe
        onSwipeComplete={() => setShowDropdown(false)}
        onBackButtonPress={() => setShowDropdown(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
          <List.Item
            title={label}
            left={(leftProps) => (
              <IconButton
                icon="close"
                onPress={() => setShowDropdown(false)}
                {...leftProps}
              />
            )}
          />
          <Searchbar
            style={{
              marginHorizontal: 15,
              marginVertical: 5,
            }}
            autoComplete={false}
            value={searchValue}
            onChangeText={setSearchValue}
            placeholder="Search"
          />
          <FlatList
            initialNumToRender={10}
            maxToRenderPerBatch={20}
            keyboardShouldPersistTaps="handled"
            data={filteredOptions}
            keyExtractor={(item) => `${item.value}`}
            renderItem={renderItem}
            onEndReached={onEndReached}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default AutoComplete;
