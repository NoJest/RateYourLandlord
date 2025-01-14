import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

function PropertyCard({ landlord }) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <p className="text-sm">
          <strong>Address:</strong> {landlord.apartment_number || 'N/A'}{' '}
          {landlord.street_number || 'N/A'} {landlord.street_name || 'N/A'}{' '}
          {landlord.zip_code || 'N/A'}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm">
          <strong>LLC:</strong> {landlord.llc || 'N/A'}
        </p>
        <CardDescription>
          Managed by: {landlord.property_management || 'N/A'}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export default PropertyCard;
