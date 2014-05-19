class Activity < ActiveRecord::Base
  establish_connection("eic_dev")
  self.table_name = 'im_activity'
  self.primary_key = 'activity_id'
  #attr_accessor :contact_name, :contact_badge, :contact_phone,:contact_mobile,:contact_email
  has_one :department,:class_name => 'Department',:primary_key => 'department_id', :foreign_key => "department_id"
  has_one :contactor,:class_name => 'Employee',:primary_key => 'contact_id', :foreign_key => "emp_id"
  accepts_nested_attributes_for :contactor
  # def user_attributes=(attributes)
  # 	if attributes['id'].present? self.user = User.find(attributes['id'])
  # 	end
  # 	super
  # end

  before_create do
    self.activity_id = self.connection.execute("select EIC.COMPANY_ACTION_SEQ.nextval id from dual").fetch[0].round
  end
end
