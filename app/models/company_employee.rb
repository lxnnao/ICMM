class CompanyEmployee < ActiveRecord::Base
  self.table_name = 'company_employee'
  self.primary_key = 'emp_sys_id'
#  belongs_to :binslimit,:primary_key => 'binslimitsid', :foreign_key => "binslimitsid"
	establish_connection("eic_dev")
end