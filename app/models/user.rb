class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  establish_connection("eic_dev")
  devise :ldap_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  def email_required?
    false
  end
  before_create do
    self.id = self.connection.execute("select EIC.EMP_SYS_ID_SEQ.nextval id from dual").fetch[0].round
  end

 	before_save :get_ldap_email
  def get_ldap_email
      self.email = Devise::LDAP::Adapter.get_ldap_param(self.badge, "mail").try :first
  end
end
