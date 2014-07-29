module ApplicationHelper
	def link_to_add_fields(name, f, association)
		new_object = f.object.send(association).klass.new
		id = new_object.object_id
		fields = f.fields_for(association, new_object, child_index: id) do |builder|
		  render(association.to_s.singularize + "_fields", f: builder)
		end
		link_to(name, '#', class: "add_fields", data: {id: id, fields: fields.gsub("\n", "")})
	end
	def link_to_select(nametext,controllername,actionname,idname=nil)
			link_to ({controller: controllername,action: actionname,id:idname}) do
			    	nametext
			end

		# if idname.present? then
		#     link_to ({controller: controllername,action: actionname},id: idname) do
		#     	nametext
		#     end
		# else
		# 	link_to ({controller: controllername,action: actionname}) do
		#     	nametext
		#     end
		# end
	end
	def link_to_new(controllername)
			link_to_select "new",controllername,"new"
	end
	def link_to_edit(controllername,idname)
			link_to_select "edit",controllername,"edit",idname
	end
	def link_to_show(controllername,idname)
			link_to_select "show",controllername,"show",idname
	end
	def link_to_delete(controllername,idname)
			link_to "destroy",{controller: controllername,action: "destroy",id:idname},method: :delete, data: { confirm: 'Are you sure?' }
	end
	def link_to_index(controllername)
			link_to_select "index",controllername,"index"
	end
	def button_to_select(nametext,controllername,actionname,idname)
		button_to nametext,{controller: controllername,action: actionname,id:idname}
	end

	def button_to_join(controllername,idname)
		button_to "join",{controller: controllername,action: "join",id:idname}
	end
end
