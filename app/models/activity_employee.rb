class ActivityEmployee < ActiveRecord::Base
  establish_connection("eic_dev")
  self.table_name = 'im_activityemployee'
  self.primary_key = 'activity_employee_id'
  has_many :activities,:class_name => 'Activity',:primary_key => 'activity_id', :foreign_key => "activity_id"
  has_many :attendees,:class_name => 'Employee',:primary_key => 'attendee_id', :foreign_key => "emp_id"

  before_create do
  	self.create_time=Time.now
    self.activity_employee_id = self.connection.execute("select EIC.COMPANY_EMP_SEQ.nextval id from dual").fetch[0].round
  end
  before_save do
    self.update_time=Time.now
  end
end