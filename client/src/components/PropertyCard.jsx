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
          <strong>Address:</strong> {landlord.apartment_number || ''}{' '}
          {landlord.street_number || ''} {landlord.street_name || ''}{' '}
          {landlord.zip_code || ''}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm">
          <strong>Corporation:</strong> {landlord.llc || 'N/A'}
        </p>
        <CardDescription>
          Managed by: {landlord.property_management || 'N/A'}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export default PropertyCard;
