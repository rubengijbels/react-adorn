export interface WrapperProps {
  children?: React.ReactNode;
}

export type Nil = undefined | null;
export type Primitive = Nil | boolean | number | string;
export type Predicate = (x: unknown) => boolean;

export type Translation = string;
export type ApiTranslationPath = string;

export interface Entity {
  guid: string;
  label: Translation | ApiTranslationPath;
}

export interface SchoolYear extends Entity {
  label: Translation;
  schools: Site[];
}

export interface Site extends Entity {
  label: ApiTranslationPath;
}
