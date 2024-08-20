import { InputType } from 'type-graphql';

import EnumFilter from '../../core/types/enum-filter';
import { LanguageCode } from '../../shared/types/language-code';

@InputType()
export class LanguageCodeFilter extends EnumFilter(LanguageCode) {}
