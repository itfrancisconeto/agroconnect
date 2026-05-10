# Base class for all application models.
#
# Shared ActiveRecord behavior, validations, scopes or model-level helpers
# can be added here when they apply to all models in the application.
class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class
end
