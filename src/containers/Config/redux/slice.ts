import { createSlice } from '@reduxjs/toolkit';
import { LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import { Appearance } from 'react-native';
import i18n from '@configs/i18n';
import RNLocalize from 'react-native-localize';
import { Global } from '@utils/appHelper';
import { REHYDRATE } from 'redux-persist';

/**
 * --- CONSTANT ---
 */

/**
 * Enum
 */
export type ThemeMode = 'light' | 'dark';

export type Language = 'en' | 'vi';

/**
 * Initial State
 */
export async function changeLanguageConfig(
  language: string,
) {
  await i18n.changeLanguage(language);
  LocaleConfig.defaultLocale = language;
  moment.locale(language);
}

function getInitialLanguage(): Language {
  try {
    const language = RNLocalize.getLocales()[0]?.languageCode === 'vi'
      ? 'vi' : 'en';
    return language;
  } catch (error) {
    return 'en';
  }
}

export const INITIAL_STATE = {
  themeMode: Appearance.getColorScheme() === 'dark' ? 'dark' : 'light' as ThemeMode,
  language: getInitialLanguage(),
  reloadBottomSheet: false,
};

/**
 * --- SLICE ---
 */
const config = createSlice({
  name: 'config',
  initialState: INITIAL_STATE,
  reducers: {
    switchTheme(state) {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
    },
    changeLanguage(state, action) {
      const language = action.payload;
      state.language = language;
      changeLanguageConfig(language);
    },
    presentBottomSheet(state) {
      state.reloadBottomSheet = !state.reloadBottomSheet;

      setTimeout(() => {
        Global.bottomSheet.ref.current.snapToIndex(0);
      }, 400);
    },
    closeBottomSheet() {
      Global.bottomSheet.ref.current.close();
    }
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action: any) => {
      if (action.payload?.config) {
        state = {
          ...action.payload.config,
          reloadBottomSheet: INITIAL_STATE.reloadBottomSheet
        };
      }
    });
  }
});

export const { switchTheme, changeLanguage, presentBottomSheet, closeBottomSheet } = config.actions;

export default config.reducer;
