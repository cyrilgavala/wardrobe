import { FC } from 'react';
import css from './Icon.module.css';
import {
  dryerNo,
  dryerYes,
  handWash,
  ironingNo,
  ironingYes,
  wash30Degrees,
  wash40Degrees,
  wash50Degrees,
  whiteningNo,
  whiteningYes,
} from './images';

const images = {
  dryerNo: dryerNo,
  dryerYes: dryerYes,
  handWash: handWash,
  ironingNo: ironingNo,
  ironingYes: ironingYes,
  wash30Degrees: wash30Degrees,
  wash40Degrees: wash40Degrees,
  wash50Degrees: wash50Degrees,
  whiteningNo: whiteningNo,
  whiteningYes: whiteningYes,
};

interface Props {
  size: string | number;
  name:
    | 'dryerNo'
    | 'dryerYes'
    | 'handWash'
    | 'ironingNo'
    | 'ironingYes'
    | 'wash30Degrees'
    | 'wash40Degrees'
    | 'wash50Degrees'
    | 'whiteningNo'
    | 'whiteningYes';
}

export const Icon: FC<Props> = (props) => {
  return (
    <div
      className={css.root}
      data-testid={`icon-${props.name}`}
      style={{ width: props.size, height: props.size }}
    >
      <img src={images[props.name]} alt={props.name} />
    </div>
  );
};
