require_relative "boot"

require "rails"
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"

Bundler.require(*Rails.groups)

module Agroconnect
  class Application < Rails::Application
    config.load_defaults 7.1

    # API-only mode keeps the backend focused on JSON responses.
    config.api_only = true

    # Time zone can be changed later if the product needs Brazilian date/time behavior.
    config.time_zone = "UTC"
  end
end
