'use client';

import type { Theme } from '@mui/material/styles';

import { merge } from 'es-toolkit';

import { alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

import type { ChartOptions } from './types';

// ----------------------------------------------------------------------

export function useChart(updatedOptions?: ChartOptions): ChartOptions {
  const theme = useTheme();

  const baseOptions = baseChartOptions(theme) ?? {};

  return merge(baseOptions, updatedOptions ?? {}) as ChartOptions;
}

// ----------------------------------------------------------------------

const baseChartOptions = (theme: Theme): ChartOptions => {
  const LABEL_TOTAL = {
    show: true,
    label: 'Total',
    color: theme.palette.text.secondary,
    fontSize: theme.typography.subtitle2.fontSize as string,
    fontWeight: theme.typography.subtitle2.fontWeight,
  };

  const LABEL_VALUE = {
    offsetY: 8,
    color: theme.palette.text.primary,
    fontSize: theme.typography.h4.fontSize as string,
    fontWeight: theme.typography.h4.fontWeight,
  };

  return {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      parentHeightOffset: 0,
      fontFamily: theme.typography.fontFamily,
      foreColor: theme.palette.text.disabled,
      animations: {
        enabled: true,
        speed: 360,
        animateGradually: { enabled: true, delay: 120 },
        dynamicAnimation: { enabled: true, speed: 360 },
      },
    },

    colors: [
      theme.palette.primary.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.error.main,
      theme.palette.success.main,
      theme.palette.warning.dark,
      theme.palette.success.dark,
      theme.palette.info.dark,
      theme.palette.info.light,
    ],

    states: {
      hover: { filter: { type: 'darken' } },
      active: { filter: { type: 'darken' } },
    },

    fill: {
      opacity: 1,
      gradient: {
        type: 'vertical',
        shadeIntensity: 0,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 100],
      },
    },

    dataLabels: { enabled: false },

    stroke: { width: 2.5, curve: 'smooth', lineCap: 'round' },

    grid: {
      strokeDashArray: 3,
      borderColor: theme.palette.divider,
      padding: { top: 0, right: 0, bottom: 0 },
      xaxis: { lines: { show: false } },
    },

    xaxis: { axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { tickAmount: 5 },

    markers: {
      size: 0,
      strokeColors: theme.palette.background.paper,
    },

    tooltip: { theme: 'false', fillSeriesColor: false, x: { show: true } },

    legend: {
      show: false,
      position: 'top',
      fontWeight: 500,
      fontSize: '13px',
      horizontalAlign: 'right',
      markers: { shape: 'circle' },
      labels: { colors: theme.palette.text.primary },
      itemMargin: { horizontal: 8, vertical: 8 },
    },

    plotOptions: {
      bar: { borderRadius: 4, columnWidth: '48%', borderRadiusApplication: 'end' },
      pie: {
        donut: { labels: { show: true, value: { ...LABEL_VALUE }, total: { ...LABEL_TOTAL } } },
      },
      radialBar: {
        hollow: { margin: -8, size: '100%' },
        track: {
          margin: -8,
          strokeWidth: '50%',
          background: alpha(theme.palette.grey[500], 0.16),
        },
        dataLabels: { value: { ...LABEL_VALUE }, total: { ...LABEL_TOTAL } },
      },
      radar: {
        polygons: {
          fill: { colors: ['transparent'] },
          strokeColors: theme.palette.divider,
          connectorColors: theme.palette.divider,
        },
      },
      polarArea: {
        rings: { strokeColor: theme.palette.divider },
        spokes: { connectorColors: theme.palette.divider },
      },
      heatmap: { distributed: true },
    },

    responsive: [
      {
        breakpoint: theme.breakpoints.values.sm,
        options: { plotOptions: { bar: { borderRadius: 3, columnWidth: '80%' } } },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: { plotOptions: { bar: { columnWidth: '60%' } } },
      },
    ],
  };
};
