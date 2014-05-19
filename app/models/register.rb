class Register < ActiveRecord::Base
  establish_connection("eic_dev")
  self.table_name = 'im_clubregister'
  self.primary_key = 'register_id'
  has_many :clubs,:class_name => 'Register',:primary_key => 'club_id', :foreign_key => "club_id"
  has_many :employees,:class_name => 'Employee',:primary_key => 'emp_id', :foreign_key => "emp_id"

  before_create do
  	self.create_time=Time.now
    self.register_id = self.connection.execute("select EIC.COMPANY_EMP_SEQ.nextval id from dual").fetch[0].round
  end

end