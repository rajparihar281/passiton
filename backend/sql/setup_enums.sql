-- Enable UUID extension (Required for all ID generation)
create extension if not exists "uuid-ossp";

-- Define Enums (Strict types for status fields)
create type verification_status as enum ('unverified', 'pending', 'verified', 'rejected');
create type item_condition as enum ('new', 'like_new', 'good', 'fair', 'poor');
create type request_status as enum ('pending', 'approved', 'rejected', 'cancelled');
create type transaction_status as enum ('active', 'completed', 'overdue', 'disputed')