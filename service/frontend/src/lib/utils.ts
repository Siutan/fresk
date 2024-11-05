import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
  y?: number;
  x?: number;
  start?: number;
  duration?: number;
};

export const flyAndScale = (
  node: Element,
  params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
  const style = getComputedStyle(node);
  const transform = style.transform === "none" ? "" : style.transform;

  const scaleConversion = (
    valueA: number,
    scaleA: [number, number],
    scaleB: [number, number]
  ) => {
    const [minA, maxA] = scaleA;
    const [minB, maxB] = scaleB;

    const percentage = (valueA - minA) / (maxA - minA);
    const valueB = percentage * (maxB - minB) + minB;

    return valueB;
  };

  const styleToString = (
    style: Record<string, number | string | undefined>
  ): string => {
    return Object.keys(style).reduce((str, key) => {
      if (style[key] === undefined) return str;
      return str + `${key}:${style[key]};`;
    }, "");
  };

  return {
    duration: params.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

      return styleToString({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t,
      });
    },
    easing: cubicOut,
  };
};

export function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  const timeInterval = Math.floor(seconds / 31536000);

  if (timeInterval >= 1) {
    return `${timeInterval} years ago`;
  }

  const timeIntervalInMonths = Math.floor(seconds / 2592000);

  if (timeIntervalInMonths >= 1) {
    return `${timeIntervalInMonths} months ago`;
  }

  const timeIntervalInWeeks = Math.floor(seconds / 604800);

  if (timeIntervalInWeeks >= 1) {
    return `${timeIntervalInWeeks} weeks ago`;
  }

  const timeIntervalInDays = Math.floor(seconds / 86400);

  if (timeIntervalInDays >= 1) {
    return `${timeIntervalInDays} days ago`;
  }

  const timeIntervalInHours = Math.floor(seconds / 3600);

  if (timeIntervalInHours >= 1) {
    return `${timeIntervalInHours} hours ago`;
  }

  const timeIntervalInMinutes = Math.floor(seconds / 60);

  if (timeIntervalInMinutes >= 1) {
    return `${timeIntervalInMinutes} minutes ago`;
  }

  return `${Math.floor(seconds)} seconds ago`;
}

export function isInt(value: string | number) {
  if (isNaN(value)) {
    return false;
  }
  const x = parseFloat(value);
  return (x | 0) === x;
}
