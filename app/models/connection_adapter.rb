class ConnectionAdapter < ActiveRecord::Base
  establish_connection("eic_dev")
end