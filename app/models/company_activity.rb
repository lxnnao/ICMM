class CompanyActivity < ActiveRecord::Base
  self.table_name = 'company_action'
  self.primary_key = 'action_sys_id'
#  belongs_to :binslimit,:primary_key => 'binslimitsid', :foreign_key => "binslimitsid"
	establish_connection("eic_dev")
end