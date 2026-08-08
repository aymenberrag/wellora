from rest_framework import serializers


class DashboardSerializer(serializers.Serializer):

    total_companies = serializers.IntegerField()

    total_fields = serializers.IntegerField()

    total_wells = serializers.IntegerField()

    active_wells = serializers.IntegerField()

    shut_in_wells = serializers.IntegerField()

    today_oil = serializers.FloatField()

    today_gas = serializers.FloatField()

    today_water = serializers.FloatField()

    ongoing_maintenance = serializers.IntegerField()

    ongoing_interventions = serializers.IntegerField()

    production_trend = serializers.ListField()

    recent_measurements = serializers.ListField()

    recent_production = serializers.ListField()

    recent_maintenance = serializers.ListField()

    recent_interventions = serializers.ListField()