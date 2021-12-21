#!/bin/sh

# Get input JSON from Wireshark, by doing "Export Packet Dissections > As JSON" on icmps.pcap

if [ "$#" -ne 2 ]; then
  echo "Incorrect number of params, specify input JSON and output PNG files"
else
  echo "Input JSON file $1";
  echo "Output PNG file $2";

  cat $1 | jq -r '.[]._source.layers.icmp | [."icmp.seq", .data."data.data", ."icmp.checksum"] | join(",")' | sort -n | cut -d',' -f2 | tr -d '\n' | xxd -r -p > $2
fi

