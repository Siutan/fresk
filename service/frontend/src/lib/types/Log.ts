import type{ RecordModel } from "pocketbase";

export interface Log extends RecordModel {
  id: string;
  app_id: string;
  build_id: string;
  app_version: string;
  app_environment: string;
  session_id: string;
  session_email: string;
  device_type: string;
  browser_name: string;
  browser_version: string;
  os_name: string;
  os_version: string;
  page_id: string;
  page_url: string;
  screen_resolution: string;
  viewport_size: string;
  memory_usage: number | null;
  network_type: string;
  language: string;
  time_zone: string;
  referrer: string | null;
  performance_metrics: Performance | null;
  sdk_version: string;
  time: number;
  log_type: string;
  value: string;
  stacktrace: string;
  decoded_stacktrace: string;
  custom: any;
}
