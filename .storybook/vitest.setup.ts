import { setProjectAnnotations } from '@storybook/react';
import { beforeAll } from 'vitest';
import preview from './preview';

const annotations = setProjectAnnotations([preview]);

beforeAll(annotations.beforeAll);
