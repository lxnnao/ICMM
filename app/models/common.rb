module Common
  before_save do
  	self.update_time=Time.now
  end
end