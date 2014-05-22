class Notice < ActiveRecord::Base
  establish_connection("eic_dev")
  self.table_name = 'im_notice'
  self.primary_key = 'notice_id'
  #attr_accessor :contact_name, :contact_badge, :contact_phone,:contact_mobile,:contact_email
  has_one :department,:class_name => 'Department',:primary_key => 'department_id', :foreign_key => "department_id"
  has_one :contacter,:class_name => 'Employee',:primary_key => 'contacter', :foreign_key => "emp_id"
  accepts_nested_attributes_for :contacter
  # def user_attributes=(attributes)
  # 	if attributes['id'].present? self.user = User.find(attributes['id'])
  # 	end
  # 	super
  # end

  before_create do
    self.notice_id = self.connection.execute("select EIC.COMPANY_ACTION_SEQ.nextval id from dual").fetch[0].round
  end
end
