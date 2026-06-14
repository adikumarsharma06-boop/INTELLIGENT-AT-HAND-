/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import * as Icons from 'lucide-react';

interface IconMapperProps {
  name: string;
  className?: string;
  size?: number;
}

export default function IconMapper({ name, className = '', size }: IconMapperProps) {
  // Resolve icon component dynamically from Lucide-react
  const IconComponent = (Icons as any)[name];
  
  if (!IconComponent) {
    // Return sparkles as default fallback
    return <Icons.Sparkles className={className} size={size} />;
  }
  
  return <IconComponent className={className} size={size} />;
}
