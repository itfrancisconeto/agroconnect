# Seed data makes the app useful immediately after `docker compose up`.
# `find_or_create_by!` keeps the seed idempotent, so it can run many times safely.

areas = [
  ["Agro Gestão", "ERP and administrative workflows for agricultural operations."],
  ["Aqila Mobile", "Field data collection, productivity estimates and geolocation workflows."],
  ["Agro Sementes", "Seed production, lots, labels, traceability and commercialization."],
  ["Agro Laboratório", "Samples, analyses, reports, certificates and lab traceability."],
  ["Agro Analisa", "Data analysis and decision support for agricultural performance."],
  ["Integrações", "APIs and integrations with external systems."],
  ["Suporte Técnico", "General technical support and customer assistance."]
]

areas.each do |name, description|
  ProductArea.find_or_create_by!(name:) do |area|
    area.description = description
  end
end

customer = Customer.find_or_create_by!(name: "Fazenda Boa Safra") do |record|
  record.document = "00.000.000/0001-00"
  record.customer_type = "rural_producer"
  record.city = "Cataguases"
  record.state = "MG"
end

seed_customer = Customer.find_or_create_by!(name: "Sementes Horizonte") do |record|
  record.document = "11.111.111/0001-11"
  record.customer_type = "seed_producer"
  record.city = "Uberlândia"
  record.state = "MG"
end

lab_area = ProductArea.find_by!(name: "Agro Laboratório")
mobile_area = ProductArea.find_by!(name: "Aqila Mobile")
analytics_area = ProductArea.find_by!(name: "Agro Analisa")

RequestTicket.find_or_create_by!(title: "Orientação para envio de amostras de sementes") do |ticket|
  ticket.customer = seed_customer
  ticket.product_area = lab_area
  ticket.description = "Cliente deseja confirmar o procedimento correto para envio de amostras de soja para análise."
  ticket.priority = "medium"
  ticket.status = "open"
  ticket.due_date = Date.today + 3.days
end

RequestTicket.find_or_create_by!(title: "Divergência na contagem de stand") do |ticket|
  ticket.customer = customer
  ticket.product_area = mobile_area
  ticket.description = "Usuário relatou divergência entre a estimativa de produtividade e a contagem de campo."
  ticket.priority = "high"
  ticket.status = "in_progress"
  ticket.due_date = Date.today + 2.days
end

RequestTicket.find_or_create_by!(title: "Comparativo de produtividade por safra") do |ticket|
  ticket.customer = customer
  ticket.product_area = analytics_area
  ticket.description = "Solicitação para análise comparativa entre safras e identificação de áreas com queda de desempenho."
  ticket.priority = "medium"
  ticket.status = "waiting_customer"
  ticket.due_date = Date.today + 7.days
end
