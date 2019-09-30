#! /usr/bin/env ruby
require 'json'

# random argument generator for alert log
class RandomArg
  def initialize(file)
    @json_file = file
    @hosts = make_hosts
    @severities = make_severities
  end

  def make_hosts
    json_data = File.open(@json_file) do |file|
      JSON.parse(file.read)
    end
    networks = json_data['ietf-network:networks']

    hosts = []
    networks['network'].each do |network|
      hosts.push(network['node'].map { |node| node['node-id'] })
    end
    hosts.flatten.sort.uniq
  end

  def make_severities
    base = %w[disaster high average warning information not_classified]
    [base, base.map{ |s| cs = s.dup; cs.capitalize!; cs }].flatten
  end

  def make_message(host)
    "something log message from #{host}"
  end

  def current_date_string
    Time.new.to_s
  end

  def make_arg
    host = @hosts.sample
    arg_data = {
      host: host,
      severity: @severities.sample,
      date: current_date_string,
      message: make_message(host)
    }
    JSON.dump(arg_data)
  end
end

file = ARGV[0] || './static/model/target3b.json'
rand_arg = RandomArg.new(file)
url = 'http://localhost:3000/api/alert'
headers = [
  'Content-type: application/json',
  'Accept: application/json'
]
header_str = headers.map { |h| "-H '#{h}'" }.join(' ')
exec_str = "curl -X POST #{url} #{header_str} -d '#{rand_arg.make_arg}'"
puts exec_str
exec exec_str
